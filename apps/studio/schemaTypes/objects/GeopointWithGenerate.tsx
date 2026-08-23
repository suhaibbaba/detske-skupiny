// GenerateLocationButton.jsx
import { Button, Box } from "@sanity/ui";
import { useState } from "react";
import { set, useFormValue } from "sanity";
import { getGeoLocation } from "@/utility/geoLocation";
import { Address } from "@/types/school";

export function GenerateLocationButton(props: any) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Get the parent postalAddress values
  const addressValue: Address = useFormValue(["address"]) || {};
  // const { patch } = useDocumentOperation(props.parent._id, props.parent._type);

  const generateMapLocation = async () => {
    setIsGenerating(true);

    try {
      const geo = await getGeoLocation(addressValue);

      if (!geo) {
        alert("Please fill in the address fields first");
        setIsGenerating(false);
        return;
      }

      if (geo) {
        props.onChange(
          set(
            {
              _type: "geopoint",
              lat: geo.lat,
              lng: geo.lng,
            },
            ["mapLocation"],
          ),
        );

        alert("✅ Location generated!");
      } else {
        alert("❌ Could not find coordinates");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("❌ Error generating location");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box padding={2} marginTop={2}>
      <Button
        text={
          isGenerating
            ? "Generating..."
            : "🗺️ Generate Map Location from Address"
        }
        tone="primary"
        onClick={generateMapLocation}
        disabled={isGenerating}
        mode="default"
        style={{ width: "100%" }}
      />
    </Box>
  );
}
