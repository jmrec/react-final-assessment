import { useParams } from "react-router-dom";

export default function MenuPageShow() {
  const { menuId } = useParams();

  return <h1>Hello, {menuId}</h1>;
}
