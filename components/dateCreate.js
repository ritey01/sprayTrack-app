const dateCreate = () => {
  return new Intl.DateTimeFormat(["ban", "id"], { dateStyle: "short" }).format(
    new Date()
  );
};

export default dateCreate;
