interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <h1>{title}</h1>;
}
