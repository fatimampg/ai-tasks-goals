// Allow input within the range (0-100)
const checkPercentageInput = (e: any) => {
  const inputValue = e.target.value;

  const keyCode = e.keyCode || e.which;

  if (
    (keyCode >= 48 && keyCode <= 57) || // Numbers 0-9
    (keyCode >= 96 && keyCode <= 105) || // Numpad numbers
    keyCode === 8 || // Backspace
    keyCode === 9 || // Tab
    keyCode === 13 || // Enter
    keyCode === 37 || // Left arrow
    keyCode === 39 || // Right arrow
    keyCode === 46 // Delete
  ) {
    if (
      (inputValue === "" && keyCode !== 46) || // Allow empty input
      (parseInt(inputValue + e.key) >= 0 && parseInt(inputValue + e.key) <= 100)
    ) {
      return;
    }
  }

  e.preventDefault();
};
export default checkPercentageInput;
