import { useState } from "react";

type ChngEvntHandler = React.ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const useField = <T extends string & any>(initValue: T) => {
  const [value, setValue] = useState<T>(initValue);
  const handleChange: ChngEvntHandler = (e) => setValue(e.target?.value as T);
  const returnVal: [T, ChngEvntHandler] = [value, handleChange];
  return returnVal;
};

export default useField;
