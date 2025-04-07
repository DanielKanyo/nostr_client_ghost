import { Input, createTheme } from "@mantine/core";

import inputClasses from "./input.module.css";

export const theme = createTheme({
    components: {
        Input: Input.extend({ classNames: inputClasses }),
    },
});
