import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TypographyProps,
} from "@mui/material";
import { TimetableRow } from "@/sanity/types";
import useTranslate from "@/hooks/useTranslate";

interface SchoolTimetableStyles {
  title?: TypographyProps;
}
const styles: SchoolTimetableStyles = {
  title: {
    sx: {
      color: "custom.ui13",
      mb: "20px",
      mt: "80px",
      fontWeight: 600,
      fontSize: "24px",
    },
  },
};

interface Props {
  timetable?: TimetableRow[];
}

export default function SchoolTimetable({ timetable }: Props) {
  const translate = useTranslate();
  if (!timetable || !timetable?.length) {
    return null;
  }

  return (
    <Box component="section">
      <Typography {...styles.title}>{translate("ourTimeTable")}</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{translate("time")}</TableCell>
              <TableCell>{translate("activity")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timetable.map((item) => (
              <TableRow key={item._key}>
                <TableCell>
                  {item.start} - {item.end}
                </TableCell>
                <TableCell>{item.activity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
