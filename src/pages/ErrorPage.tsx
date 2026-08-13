export default function ErrorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">
        The page you are looking for does not exist.
      </p>
    </div>
  );
}