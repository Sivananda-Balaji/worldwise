import { useNavigate } from "react-router-dom";
import Button from "./Button";

const BackButton = () => {
  const navigate = useNavigate();
  const handleBack = (event) => {
    event.preventDefault();
    navigate(-1);
  };
  return (
    <Button type="back" onClick={handleBack}>
      &larr; Back
    </Button>
  );
};

export default BackButton;
