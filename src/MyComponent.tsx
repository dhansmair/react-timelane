interface MyComponentProps {
  title: string;
}

function MyComponent({ title }: MyComponentProps) {
  return <h1>{title}</h1>;
}

export default MyComponent;
