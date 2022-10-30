import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { mask } from "remask";
import "./form.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

//validação de formulario
const schema = yup
  .object({
    name: yup
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .required(),
    email: yup
      .string()
      .email("Digite um email valido")
      .required("e-mail é um campo obrigatório"),
    telefone: yup
      .string()
      .min(11, "Telefone deve ter pelo menos 11 caracteres")
      .required(),
    cpf: yup
      .string()
      .min(11, "CPF deve ter pelo menos 11 caracteres")
      .required(),
    // pais: yup.string().required("Pais é um campo obrigatório"),
    //cidade: yup.string().required("Cidade é um campo obrigatório"),
  })
  .required();
//registrar usuario
const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit(data) {
    console.log(data);
  }
//informar erros
  console.log(errors);
//maskaras dos campos
  const [value, setValue] = useState("");
  const onChange = (data) => {
    setValue(mask(data.target.value, ["999.999.999-99"]));
  };

  const [tel, setTel] = useState("");
  const onC = (data) => {
    setTel(mask(data.target.value, ["(99) 9 9999-9999"]));
  };
//buscando dados da api
  const [options, setOptions] = useState("");
  useEffect(() => {
    axios.get("https://amazon-api.sellead.com/country").then(({ data }) => {
      setOptions(
        data.map((data) => {
          return {
            key: data.code,
            label: data.name_ptbr,
            value: data.name_ptbr,
          };
        })
      );
    });

    setOptions();
  }, []);
  const [options1, setOp] = useState(" ");

  useEffect(() => {
    axios.get("https://amazon-api.sellead.com/city").then(({ data }) => {
      setOp(
        data.map((data) => {
          return {
            key: data.code,
            label: data.name_ptbr,
            value: data.name_ptbr,
          };
        })
      );
    });

    setOp();
  }, []);
//retorno como formulario
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        Nome*
        <input
          {...register("name", { required: true })}
          placeholder="Digite um nome!"
        />
        {errors.name && <span>{errors.name?.message}</span>}
      </label>

      <label>
        E-mail*
        <input {...register("email")} placeholder="Digite um E-mail" />
        {errors.email && <span>{errors.email?.message}</span>}
      </label>

      <label>
        Telefone*
        <input
          {...register("telefone")}
          onChange={onC}
          value={tel}
          placeholder="(99) 9 9999-9999"
        />
        {errors.telefone && <span>{errors.telefone?.message}</span>}
      </label>

      <label>
        CPF*
        <input
          {...register("cpf")}
          onChange={onChange}
          value={value}
          placeholder="999.999.999-99"
        />
        {errors.cpf && <span>{errors.cpf?.message}</span>}
      </label>

      <label>
        País
        <Select
          className="pais"
          options={options}
          onChange={(data) => onSubmit(data)}
          isMulti
          placeholder="Paises"
        />
      </label>

      <label>
        Cidade
        <Select
          className="cidade"
          options={options1}
          isMulti
          onChange={(data) => onSubmit(data)}
          placeholder="Cidades"
        />
      </label>

      <button className="" type="submit">
        Enviar
      </button>
    </form>
  );
};

export default Form;
