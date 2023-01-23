const dateCreate = () => {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "short" }).format(
    new Date()
  );
};

export default dateCreate;
