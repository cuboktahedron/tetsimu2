import { useWindowSize } from "@react-hook/window-size";

const menuWidth = 48;
const baseWidth = 480;
const baseHeight = 672;

const useSimutatorZoom = (isSmall: boolean): number => {
  const [width, height] = useWindowSize();

  if (isSmall) {
    const widthRatio = (width - menuWidth) / baseWidth;
    const heightRatio = height / baseHeight;

    if (widthRatio < heightRatio) {
      return widthRatio;
    } else {
      return heightRatio;
    }
  } else {
    return 1;
  }
};

export default useSimutatorZoom;
