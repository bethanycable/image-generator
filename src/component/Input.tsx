function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return <input { ...props} className="border-2 border-gray-800 dark:text-gray-800 px-4 py-2 rounded outline-none focus:border-cyan-600 focus:border-2" type="text"></input>
}

export default Input;
