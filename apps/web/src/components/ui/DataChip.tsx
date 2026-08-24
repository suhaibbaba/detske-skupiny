import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

/**
 * A pill whose outline colour comes from the content, not the theme.
 *
 * A school's tags and the catalog's tag filter render the same pill - the 24px
 * radius, 12px text, a label with no padding of its own and an icon inset 4px
 * from it - and differ only in their padding and which colour token they use,
 * which stays at the call site.
 *
 * The school-type badge deliberately does NOT use this: it leaves MUI's own
 * chip icon margins in place, and inheriting these would move it.
 */
const DataChip = styled(Chip)({
  borderRadius: "24px",
  fontSize: 12,
  "& .MuiChip-label": { padding: 0 },
  "& .MuiChip-icon": { marginRight: "4px", marginLeft: 0 },
});

export default DataChip;
