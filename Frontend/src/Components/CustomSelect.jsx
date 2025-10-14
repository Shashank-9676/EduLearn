import Select from "react-select";


export default function CustomSelect({label, value, onChange, options = [], loading = false,Color}) {
  const selectedOption = options.find((opt) => opt.value === value) || null;
  
const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: state.isFocused ? "#60a5fa" : "rgba(6, 2, 19, 0.25)",
    boxShadow: state.isFocused ? "0 0 0 2px #60a5fa" : "none",
    borderRadius: "0.75rem",
    padding: "4px",
    transition: "all 0.3s",
    "&:hover": {
      borderColor: "#60a5fa",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
    color: "black",
    borderRadius: "0.75rem",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "#60a5fa"
      : isFocused
      ? "rgba(96,165,250,0.2)"
      : "white",
    color: isSelected ? "white" : "black",
  }),
  singleValue: (base) => ({
    ...base,
    color: Color === 'blue' ? "white" : "black",
  }),
  placeholder: (base) => ({
    ...base,
    color: Color == 'blue' ? "white" : "rgba(27, 19, 19, 0.6)",
  }),
};
  return (
    <Select required isLoading={loading} placeholder={label} styles={customStyles} options={options} value={selectedOption} onChange={(selected) => onChange(selected ? selected.value : "")} isSearchable isClearable />
  );
}
