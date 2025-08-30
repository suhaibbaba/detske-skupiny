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

interface SchoolTimetableStyles {
  title?: TypographyProps;
}
const styles: SchoolTimetableStyles = {
  title: {
    color: "custom.ui13",
    fontSize: "24px",
    fontWeight: 600,
    mt: "80px",
    mb: "20px",
  },
};

interface Props {
  timetable?: TimetableRow[];
}

export default function SchoolTimetable({ timetable }: Props) {
  if (!timetable || !timetable?.length) {
    return null;
  }

  return (
    <Box component="section">
      <Typography {...styles.title}>Our time table</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Activity</TableCell>
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
