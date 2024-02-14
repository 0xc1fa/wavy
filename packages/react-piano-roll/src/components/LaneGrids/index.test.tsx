import { test, expect } from "@playwright/experimental-ct-react";
import LaneGrids from ".";

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<LaneGrids />);
  // await expect(component).toContainText('Learn React');
});
