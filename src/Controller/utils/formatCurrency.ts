const formatCurrency = (currency: string, amount: number): string => {
  const decimal = new Intl.NumberFormat("en-US", { style: "decimal" }).format(
    amount
  );

  if (currency === "usd") {
    return `$` + decimal;
  }
  if (currency === "brl") {
    return `R$` + decimal;
  }
};

export default formatCurrency;
