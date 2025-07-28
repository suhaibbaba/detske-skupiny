import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
  useTheme,
  GridBaseProps,
  TypographyOwnProps,
} from "@mui/material";
import Textarea from "@/components/ui/textarea/Textarea";
import { formatMessage } from "@/utilites/strings";
import { FC } from "react";

interface Props {
  translate: (key: string) => string;
}

interface ContactUsStyles {
  container?: BoxProps;
  title?: TypographyOwnProps;
  fullWidthGrid?: GridBaseProps;
  halfWidthGrid?: GridBaseProps;
}

const styles: ContactUsStyles = {
  container: {
    sx: {
      bgcolor: "common.white",
      p: "32px",
      borderRadius: "16px",
    },
  },
  title: {
    variant: "h3",
  },
  fullWidthGrid: {
    size: 12,
  },
  halfWidthGrid: {
    size: {
      xs: 12,
      sm: 6,
    },
  },
};

const ContactForm: FC<Props> = ({ translate }) => {
  const theme = useTheme();

  return (
    <Box {...styles.container}>
      <Grid container rowSpacing={3} columnSpacing={4}>
        <Grid {...styles.fullWidthGrid}>
          <Typography {...styles.title}>
            {translate("Send Your Inquiry")}
          </Typography>
        </Grid>
        <Grid {...styles.fullWidthGrid}>
          <Typography>{translate("formDescription")}</Typography>
        </Grid>
        <Grid {...styles.halfWidthGrid}>
          <TextField
            placeholder={translate("Your name")}
            variant="outlined"
            fullWidth
            className="rounded"
          />
        </Grid>
        <Grid {...styles.halfWidthGrid}>
          <TextField
            placeholder={translate("name@example.com")}
            variant="outlined"
            fullWidth
            className="rounded"
          />
        </Grid>
        <Grid {...styles.fullWidthGrid}>
          <Textarea
            aria-label="minimum height"
            minRows={5}
            placeholder={translate("Write text here ...")}
          />
        </Grid>
        <Grid {...styles.fullWidthGrid}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography fontSize="12px">
                  {formatMessage(
                    "By submitting this form, you confirm that you have read and agree to {0} and Privacy Statement {1}",
                    <Typography
                      fontSize="inherit"
                      color={theme.palette.custom.ui1}
                      component="span"
                    >
                      Terms of Service
                    </Typography>,
                    <Typography
                      fontSize="inherit"
                      color={theme.palette.custom.ui1}
                      component="span"
                    >
                      Privacy Statement
                    </Typography>,
                  )}
                </Typography>
              }
            />
          </FormGroup>
        </Grid>
        <Grid size={12}>
          <Button variant="contained" fullWidth>
            {translate("Send Message")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactForm;
