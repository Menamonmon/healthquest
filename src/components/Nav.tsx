import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  VStack,
  Divider,
} from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Route, Switch } from "react-router";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { NavRoute } from "../types";
import ProtectedRoute, { UnprotectedRoute } from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  routes: NavRoute[];
}

const NavDrawerItem: React.FC<{ pageTitle: string; path: string }> = ({
  pageTitle,
  path,
}) => (
  <Fragment>
    <ListItem as={RouterLink} to={path}>
      {pageTitle}
    </ListItem>
    <Divider />
  </Fragment>
);

const Nav: React.FC<Props> = ({ routes }) => {
  const [currentPageTitle, setCurrentPageTitle] = useState("My Page");
  const [currentRoutes, setCurrentRoutes] = useState<NavRoute[]>([]);

  const { isAuthenticated } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const history = useHistory();

  history.listen((location) => {
    const pagePath = location.pathname;
    const matchingRoute = routes.find((r) => r.path === pagePath);
    setCurrentPageTitle(
      matchingRoute ? matchingRoute.pageTitle : "INVALID PAGE"
    );
  });

  useEffect(() => {
    const pagePath = history.location.pathname;
    const matchingRoute = routes.find((r) => r.path === pagePath);
    setCurrentPageTitle(
      matchingRoute ? matchingRoute.pageTitle : "INVALID PAGE"
    );
  }, [routes, history]);

  useEffect(() => {
    setCurrentRoutes(
      routes.filter((route) => {
        const { _protected, unprotected, onDrawer } = route;
        if (onDrawer) {
          if (_protected && isAuthenticated) {
            return route;
          } else if (unprotected && !isAuthenticated) {
            return route;
          }
        }
        return null;
      })
    );
  }, [isAuthenticated, routes]);

  return (
    <VStack spacing="0">
      <Flex
        flexDir="row"
        alignItems="center"
        w="100%"
        bgColor="blue.100"
        p="10px"
        boxShadow="lg"
      >
        <IconButton
          ref={btnRef}
          colorScheme="blue"
          aria-label="nav-toggle"
          onClick={onOpen}
        >
          <GiHamburgerMenu />
        </IconButton>
        <Heading flex="0.9" textAlign="center" size="sm">
          {currentPageTitle}
        </Heading>
      </Flex>
      <Box w="100vw" h="calc(100vh - 60px)" p="5px">
        <Switch>
          {routes.map(
            ({ _protected, unprotected, pageTitle, ...rest }, idx) => {
              if (_protected) {
                return <ProtectedRoute exact strict {...rest} key={idx} />;
              } else if (unprotected) {
                return <UnprotectedRoute exact strict {...rest} key={idx} />;
              } else {
                return <Route exact strict {...rest} key={idx} />;
              }
            }
          )}
        </Switch>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>HealthQuest</DrawerHeader>
          <DrawerBody>
            <List onClick={onClose}>
              {currentRoutes.map(({ pageTitle, path }, idx) => (
                <NavDrawerItem pageTitle={pageTitle} path={path} key={idx} />
              ))}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

export default Nav;
