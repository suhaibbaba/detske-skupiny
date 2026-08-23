import { ObjectInputProps } from "sanity";
import { Button, Card, Dialog, Stack, Box } from "@sanity/ui";
import { useState } from "react";
import { ObjectInput } from "sanity";
import { GenerateLocationButton } from "@/schemaTypes/objects/GeopointWithGenerate";

export function LocationAddressInput(props: ObjectInputProps) {
  const [open, setOpen] = useState(false);
  const value = props.value || {};

  const hasAddress = value.city || value.street;
  const displayText = hasAddress
    ? `Edit Location: ${[value.street, value.city, value.postalCode].filter(Boolean).join(", ")}`
    : "Add Location & Address";

  return (
    <>
      <Button
        text={displayText}
        onClick={() => setOpen(true)}
        mode="ghost"
        tone={hasAddress ? "default" : "critical"}
      />

      {open && (
        <Dialog
          header="Location & Address"
          id="location-address-dialog"
          onClose={() => setOpen(false)}
          width={2}
        >
          <Box padding={4}>
            <ObjectInput {...props} />
            <GenerateLocationButton {...props} />
          </Box>
        </Dialog>
      )}
    </>
  );
}
