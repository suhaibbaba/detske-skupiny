import React from "react";
import { Card, Flex, Text, Grid } from "@sanity/ui";
import { CheckmarkIcon } from "@sanity/icons";

type Props = {
  items?: Array<{ text?: string }>;
};

export default function ChecklistPreview(props: Props) {
  const items = props?.items || [];
  return (
    <Card padding={3} radius={2}>
      {items.length === 0 ? (
        <Text muted size={1}>
          No items yet
        </Text>
      ) : (
        <Grid columns={[2, 2, 2, 2]} gap={[3, 3, 3, 3]}>
          {items.map((item, idx) => (
            <Flex flex={1} key={idx} align="center" gap={2}>
              <CheckmarkIcon color="green" />
              <Text size={1}>{item?.text || "Untitled item"}</Text>
            </Flex>
          ))}
        </Grid>
      )}
    </Card>
  );
}
