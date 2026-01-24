const page = () => {
  const verify = () => {
    alert("Verified");
  };
  return (
    <div>
      <div>
        <h1>NIN Verification</h1>
        <input type="text" placeholder="Enter Your NIN" />
        <button
        className= ""
         onKeyDown={(e) => e.key === "Enter" && verify()}>Enter</button>
      </div>
    </div>
  );
};

export default page;
