interface IGeneralProperty {
  body: string;
  text: string;
}

interface IButton<T> {
  default: T;
  hover: T;
}

interface IStatusButton<T> {
  success: T;
  warning: T;
  danger: T;
}

export interface ITheme {
  body: string;
  text: string;
  border: string;
  svg: {
    fill: string;
  };
  section: {
    body: string;
    text: string;
  };
  button: IStatusButton<IButton<IGeneralProperty>>;
}

const primary = {
  blue: "#581B98",
  purple: "#9C1DE7",
  pink: "#F3558E",
  yellow: "#F3558E",
  grey: "#AF9FC0",
};

const neutral = {
  text: "#000",
  textInverted: "#fff",
  "100": "#fff",
  "200": "#f4f5f7",
  "300": "#e1e1e1",
  "400": "#737581",
  "500": "#4a4b53",
  "600": "#000",
};

const success = {
  "100": "#529E66",
  "200": "#367B48",
  "300": "#276738",
};

const error = {
  "100": "#D0454C",
  "200": "#B54248",
  "300": "#95353A",
};

const warning = {
  "100": "#E1C542",
  "200": "#CAB23F",
  "300": "#B49E35",
};

const light: ITheme = {
  body: neutral.textInverted,
  text: neutral.text,
  border: neutral["100"],
  svg: {
    fill: "",
  },
  section: {
    body: neutral.textInverted,
    text: neutral.text,
  },
  button: {
    success: {
      default: {
        body: "",
        text: "",
      },
      hover: {
        body: "",
        text: "",
      },
    },
    warning: {
      default: {
        body: "",
        text: "",
      },
      hover: {
        body: "",
        text: "",
      },
    },
    danger: {
      default: {
        body: "",
        text: "",
      },
      hover: {
        body: "",
        text: "",
      },
    },
  },
};

const dark: ITheme = {
  body: neutral.text,
  text: neutral.textInverted,
  border: neutral.textInverted,
  svg: {
    fill: "",
  },
  section: {
    body: neutral.textInverted,
    text: neutral.text,
  },
  button: {
    success: {
      default: {
        body: "",
        text: "",
      },
      hover: {
        body: "",
        text: "",
      },
    },
    warning: {
      default: {
        body: "",
        text: "",
      },
      hover: {
        body: "",
        text: "",
      },
    },
    danger: {
      default: {
        body: "",
        text: "",
      },
      hover: {
        body: "",
        text: "",
      },
    },
  },
};

const getTheme = (mode: string): ITheme => (mode === "dark" ? dark : light);

export { getTheme };
