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

const shapes = [
  'square',
  'circle',
  'rounded',
]

const styles = [
  'claymorphic',
  '3D rendered',
  'pixelated',
  'illustrated',
  'color pencil',
  'digital art',
  'abstract painting',
  'watercolor drawing',
  'other'
]

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState({
    prompt: "",
    color: "",
    numberOfCovers: "1",
    shape: "",
    style: ""
  });
  const [imagesUrl, setImagesUrl] = useState<{imageLink: string }[]>([])
  const [error, setError] = useState("");

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      setImagesUrl(data);
    },
    onError(error) {
      console.log(error);
      setError(error.message);
    }
  })

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    generateIcon.mutate({
      ...form,
      numberOfCovers: parseInt(form.numberOfCovers)
    });
  }

  function updateForm(key: string) {
    return function(e: React.ChangeEvent<HTMLInputElement>) {
      setForm({
        ...form,
        [key]: e.target.value
      })
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
            2. Pick a color you would like the background of your cover to be.
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

          <h2 className="text-xl">
            3. Pick how many versions of the cover you want.
          </h2>
          <FormGroup className="mb-12">
              <label className="">Number of covers: (Max 10 covers at a time)</label>
              <Input 
                inputMode="numeric"
                pattern="[1-9]|10"
                type="number"
                required
                value={form.numberOfCovers}
                onChange={updateForm("numberOfCovers")}
                />
          </FormGroup>

          <h2 className="text-xl">
            4. Pick a shape.
          </h2>
          <FormGroup className="grid grid-cols-4 mb-12">
            {shapes.map(shape => (
              <label key={shape} className="flex gap-2 text-l">
                <input 
                  type="radio" 
                  name={shape} 
                  value={shape}
                  checked={shape === form.shape}
                  onChange={() => setForm((prevForm) => ({ ...prevForm, shape }))}
                  ></input>
                {shape}
              </label>
            ))}
          </FormGroup>

          <h2 className="text-xl">
            5. Pick a style you would like your cover to be in.
          </h2>
          <FormGroup className="grid grid-cols-4 mb-12">
            {styles.map(style => (
              <label key={style} className="flex gap-2 text-l">
                <input 
                  type="radio" 
                  name={style} 
                  value={style}
                  checked={style === form.style}
                  onChange={() => setForm((prevForm) => ({ ...prevForm, style }))}
                  ></input>
                {style}
              </label>
            ))}
          </FormGroup>
            {/* TODO: Allow user to type in their own style when other option is checked */}
          {form.style === "other" && (
            <Input 
              value={form.style}
              required
              onChange={updateForm("style")}
            />
          )}

          {error && (
            <div className="bg-red-500 text-white font-bold text-center p-4  rounded">
              {error}
            </div>
          )}

          <Button 
            isLoading={generateIcon.isLoading}
            disabled={generateIcon.isLoading}
          >
            Submit
          </Button>
        </form>

        { imagesUrl.length > 0 && 
          <>
            <h2 className="text-l">
              Your Book Covers:
            </h2>
            <section className="grid grid-cols-4 gap-4 mb-12">
              {imagesUrl.map(({imageLink}) => (
                  <Image
                    key={imageLink}
                    src={imageLink} 
                    alt="ai generated image"
                    width="256"
                    height="256"
                  />
                ))
              }
            </section>
          </>   
        }  
      </main>
    </>
  );
};

export default GeneratePage;
