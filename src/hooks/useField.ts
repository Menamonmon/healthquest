import { useState } from "react";

type ChngEvntHandler = React.ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const useField: (initValue: string) => [string, ChngEvntHandler] = (
  initValue: string
) => {
  const [value, setValue] = useState(initValue);
  const handleChange: ChngEvntHandler = (e) => setValue(e.target?.value);
  return [value, handleChange];
};

export default useField;
