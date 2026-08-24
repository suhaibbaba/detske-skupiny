import type { SxProps, Theme } from "@mui/material/styles";
import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useTranslate from "@/hooks/useTranslate";

interface Props {
  value?: {
    heading?: string;
    headers: string[];
    rows: {
      _key: string;
      cells: (string | number)[];
    }[];
  };
}

const styles = {
  title: {
    mb: "20px",
    mt: "80px",
  },
} satisfies Record<string, SxProps<Theme>>;

export default function Table({ value }: Props) {
  const translate = useTranslate();
  if (!value || (!value.headers.length && !value?.rows.length)) {
    return null;
  }

  return (
    <Box component="section">
      {value.heading && (
        <Typography variant="h2" sx={styles.title}>
          {translate(value.heading)}
        </Typography>
      )}
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow>
              {value.headers.map((heading) => (
                <TableCell key={heading}>{translate(heading)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {value.rows.map((item) => (
              <TableRow key={item._key}>
                {item.cells.map((cell, idx) => (
                  <TableCell key={`${cell}_${idx}`}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  );
}
