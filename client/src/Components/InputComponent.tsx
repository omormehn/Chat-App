/* eslint-disable react/prop-types */
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputComponentProps } from "../../types/types";



const InputComponent = ({
    placeholder,
    name,
    isPasswordVisible,
    togglePassword,
    onChange
}: InputComponentProps) => (
    <div className="flex relative ">
        <input
            type={isPasswordVisible ? "text" : "password"}
            name={name}
            placeholder={placeholder}
            className="auth-inputs w-full bg-black "
            onChange={onChange}
            
        />

        {isPasswordVisible ? (
            <FaEyeSlash
                onClick={togglePassword}
                className="absolute right-4 top-4 cursor-pointer"
                size={15}
                color="white" />
        ) : (
            <FaEye
                onClick={togglePassword}
                className="absolute right-4 top-4 cursor-pointer"
                size={15}
                color="white" />
        )}
    </div>
);

export default InputComponent;
