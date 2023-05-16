import { type NextPage } from "next";
import Head from "next/head";
import Input from "../component/Input"
import FormGroup from "../component/FormGroup"
import React, { useState } from "react";
import { api } from "~/utils/api";
import Button from "~/component/Button";
import Image from "next/image";

const colors = [
  'blue',
  'red',
  'yellow',
  'green',
  'pink',
  'orange',
  'white',
  'black'
]

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState({
    prompt: "",
    color: ""
  });
  const [imageUrl, setImageUrl] = useState('')

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      if(!data.imageLink) return;
      setImageUrl(data.imageLink);
    }
  })

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    generateIcon.mutate(form);
    // setForm((prevForm) => ({...prevForm, prompt: ""}));
  }

  function updateForm(key: string) {
    return function(e: React.ChangeEvent<HTMLInputElement>) {
      setForm({
        ...form,
        [key]: e.target.value
      });
    }
  }

  return (
    <>
      <Head>
        <title>Generate Your Book Covers</title>
        <meta name="description" content="Generate your book covers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col mt-24 px-8 gap-4">
        <h1 className="text-5xl">Generate your Book Covers</h1>
        <p className="text-2xl mb-12">Fill out the form below to start generating your book covers.</p>
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <h2 className="text-xl">
            1. Describe what you want your cover to look like.
          </h2>
          <FormGroup className="mb-12">
            <label>Prompt:</label>
            <Input 
              value={form.prompt}
              required
              onChange={updateForm("prompt")}
            />
          </FormGroup>

          <h2 className="text-xl">
            2. Describe what you want your cover to look like.
          </h2>
          <FormGroup className="grid grid-cols-4 mb-12">
            {colors.map(color => (
              <label key={color} className="flex gap-2 text-l">
                <input 
                  type="radio" 
                  name={color} 
                  value={color}
                  checked={color === form.color}
                  onChange={() => setForm((prevForm) => ({ ...prevForm, color }))}
                  ></input>
                {color}
              </label>
            ))}
            
          </FormGroup>

          {/* <h2 className="text-l">1. Describe what you want your cover to look like.</h2>
          <FormGroup>
            <label>Prompt:</label>
            <Input 
              value={form.prompt}
              onChange={updateForm("prompt")}
            />
          </FormGroup>

          <h2 className="text-l">1. Describe what you want your cover to look like.</h2>
          <FormGroup>
            <label>Prompt:</label>
            <Input 
              value={form.prompt}
              onChange={updateForm("prompt")}
            />
          </FormGroup> */}

          <Button 
            isLoading={generateIcon.isLoading}
            disabled={generateIcon.isLoading}
          >
            Submit
          </Button>
        </form>

        { imageUrl && 
          <>
            <h2 className="text-l">
              Your Book Covers:
            </h2>
            <section className="grid grid-cols-4 gap-4 mb-12">
              <Image
                src={imageUrl} 
                alt="ai generated image"
                width="150"
                height="150"
              />
            </section>

          </>   
        }
        
      </main>
    </>
  );
};

export default GeneratePage;
