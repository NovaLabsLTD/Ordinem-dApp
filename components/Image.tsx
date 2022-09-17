import NextImage, { ImageProps } from "next/image";

function Image({ className, ...props }: ImageProps) {
  return (
    <div className={"image-container " + className}>
      <NextImage layout="fill" {...props} />
    </div>
  );
}

export default Image;
