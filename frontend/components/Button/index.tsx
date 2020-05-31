import styled, {css} from "styled-components";

/**
 * Button interface
 * 
 * @property {string} varientColor Color of the button
 * @property {string} varient Button type whether it's a link, solid or outline
 * @property {ButtonSizes} size  size of the button
 * @todo icons use react-icons
 * @author rakeshShubhu
 */
interface IButtonProps {
  varientColor: string;
  varient: string;
  size: "sm" | "md" | "lg";
  ariaLabel: string;
  disabled ?: boolean;
}

const BaseButton = css`
  height: "auto",
  lineHeight: "normal",
`;

const OutlineButton = css`

`;

const LinkButton = css`
  &:hover{
    text-decoration: underline;
  }

`;

const SolidButton = css``;

const StyledButton = styled.button`
  background: ${({theme})=> theme.button.success.default.body};  
  border: 1px solid ${({theme})=> theme.button.success.default.body};  
  width: fit-content;
  min-width: 125px;
  padding: 10px 15px;
  color: white;
  font-size: ${(props)=> props.theme.fontSizes.md};
  font-family: ${(props)=> props.theme.fonts.heading};
  font-weight: ${(props)=> props.theme.fontWeights.bold};
  border-radius: 5px;
  transition: background 300ms;

  &:hover{
    background: #55b97f;
    cursor: pointer;
  }

  &:focus{
    outline: none;
  }
`;

const Button: React.FC<IButtonProps> = ({
  children,
  ariaLabel,
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton {...props} aria-label={ariaLabel} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default Button;