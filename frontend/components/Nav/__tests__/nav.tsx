import { render } from "@testing-library/react";
import { ThemeContextProvider } from "../../ThemeProvider/ThemeProvider";

import Nav from "../index";

it("nav renders correctly", () => {
  const { container, debug } = render(
    <ThemeContextProvider>
      <Nav />
    </ThemeContextProvider>
  );
  expect(container).toMatchInlineSnapshot();
});
