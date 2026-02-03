export function ImageView(props: { url: string }) {
  return (
    <div class="size-full">
      <img src={props.url} />
    </div>
  );
}
