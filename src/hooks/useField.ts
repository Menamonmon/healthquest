import { useState } from "react";

type ChngEvntHandler = React.ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const useField = <T extends string & any>(initValue: T) => {
  const [value, setValue] = useState<T>(initValue);
  const handleChange: ChngEvntHandler = (e) => setValue(e.target?.value as T);
  const returnVal: [
    T,
    ChngEvntHandler,
    React.Dispatch<React.SetStateAction<T>>
  ] = [value, handleChange, setValue];
  return returnVal;
};

export default useField;
