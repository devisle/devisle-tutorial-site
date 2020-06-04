interface IGeneralProperty {
    body: string;
    text: string;
}

interface IButton {
    default: IGeneralProperty;
    hover: IGeneralProperty;
}

interface IStatusButton {
    success: IButton;
    warning: IButton;
    danger: IButton;
}

export interface ITheme {
    body: string;
    text: string;
    border: string;
    link: {
        hovered: string;
        text: string;
    };
    fadedText: string;
    svg: {
        fill: string;
    };
    section: { border: string } & IGeneralProperty;
    button: IStatusButton;
}

const primary = {
    blue: '#581B98',
    purple: '#9C1DE7',
    pink: '#F3558E',
    yellow: '#F3558E',
    grey: '#AF9FC0'
};

const neutral = {
    text: '#000',
    textInverted: '#fff',
    '100': '#fff',
    '200': '#ededed',
    '300': '#e1e1e1',
    '400': '#737581',
    '500': '#4a4b53',
    '600': '#000',
    '700': '#737070'
};

const success = {
    '100': '#529E66',
    '200': '#27AE60',
    '300': '#367B48',
    '400': '#276738'
};

const error = {
    '100': '#D0454C',
    '200': '#B54248',
    '300': '#95353A'
};

const warning = {
    '100': '#E1C542',
    '200': '#CAB23F',
    '300': '#B49E35'
};

const light: ITheme = {
    body: neutral.textInverted,
    text: neutral.text,
    link: {
        text: neutral.text,
        hovered: primary.blue
    },
    fadedText: neutral[700],
    // border: neutral["100"],
    border: primary.blue,
    svg: {
        fill: ''
    },
    section: {
        body: neutral[200],
        border: neutral[200],
        text: neutral.text
    },
    button: {
        success: {
            default: {
                body: success['200'],
                text: '#fff'
            },
            hover: {
                body: '',
                text: ''
            }
        },
        warning: {
            default: {
                body: '',
                text: ''
            },
            hover: {
                body: '',
                text: ''
            }
        },
        danger: {
            default: {
                body: '',
                text: ''
            },
            hover: {
                body: '',
                text: ''
            }
        }
    }
};

const dark: ITheme = {
    body: neutral.text,
    text: neutral.textInverted,
    link: {
        text: neutral.text,
        hovered: primary.blue
    },
    fadedText: neutral[700],
    border: neutral.textInverted,
    svg: {
        fill: ''
    },
    section: {
        body: neutral.textInverted,
        border: neutral.textInverted,
        text: neutral.text
    },
    button: {
        success: {
            default: {
                body: '',
                text: ''
            },
            hover: {
                body: '',
                text: ''
            }
        },
        warning: {
            default: {
                body: '',
                text: ''
            },
            hover: {
                body: '',
                text: ''
            }
        },
        danger: {
            default: {
                body: '',
                text: ''
            },
            hover: {
                body: '',
                text: ''
            }
        }
    }
};

const getTheme = (mode: string): ITheme => (mode === 'dark' ? dark : light);

export { getTheme };
