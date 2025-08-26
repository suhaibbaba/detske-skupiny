import { Alert, Container } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const NoPageContent = ({ children }: Props) => {
  return (
    <Container sx={{ py: 5 }}>
      <Alert severity="warning" sx={{ maxWidth: 600 }}>
        {children}
      </Alert>
    </Container>
  );
};

export default NoPageContent;
