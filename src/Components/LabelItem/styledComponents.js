import styled from "styled-components";

export const Labelitem = styled.li`
  height: 20px;
  width: 100px;
  border-radius: 5px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 18px;
  font-family: "Roboto";
  font-weight: 500;
  width: 90%;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 5px;
`;

export const Logo = styled.span`
  color: ${props => props.color};
  font-size: 23px;
  margin-top: 10px;
  margin-right: 10px;
`