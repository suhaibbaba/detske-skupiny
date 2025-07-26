import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
  Button,
  ButtonProps,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddKinderGroupSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
  button?: ButtonProps;
}

const styles: AddKinderGroupSectionStyles = {
  section: {
    sx: {
      backgroundImage:
        "linear-gradient(0deg, rgba(250, 243, 192, 0.8), rgba(250, 243, 192, 0.8)), url('/balloon-bg.jpg')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      textAlign: "center",
      py: "96px",
    },
  },
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  title: {
    variant: "h1",
    fontSize: "36px",
    sx: {
      mb: "16px",
    },
  },
  description: {
    sx: {
      mb: "32px",
    },
  },
  button: {
    variant: "primary",
    sx: {
      "& .MuiButton-startIcon": {
        marginRight: "8px",
      },
    },
    startIcon: <AddIcon />,
  },
};

const AddKinderGroupSection = () => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.title}>Add Your Kinder Group</Typography>
        <Typography {...styles.description}>
          Do You Run a Kinder Group? Join Our Platform — It’s Free to Start!
        </Typography>
        <Button {...styles.button}>Add Your Kinder Group</Button>
      </Container>
    </Box>
  );
};

export default AddKinderGroupSection;
