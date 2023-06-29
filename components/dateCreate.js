const dateCreate = (e) => {
  if (e) {
    return new Intl.DateTimeFormat(["ban", "id"], {
      dateStyle: "short",
    }).format(new Date(e));
  } else {
    return new Intl.DateTimeFormat(["ban", "id"], {
      dateStyle: "short",
    }).format(new Date());
  }
};

export default dateCreate;
