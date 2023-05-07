export function formatCurrency(data) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  });

  return formatter.format(data);
}

export const formatNumeric = (data) => (data < 10 ? "0" + data : data);
