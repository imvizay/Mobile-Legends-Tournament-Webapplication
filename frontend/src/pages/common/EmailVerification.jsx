import {
  Mail,
  ShieldCheck,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";


export const EmailVerificationPending = () => {
  const email = "player@example.com";

  return (
    <section
      className=" min-h-screen bg-[#F8F6F3] flex items-center justify-center px-2 py-2 md:py-4 md:px-4">
      <div
        className=" w-full max-w-2xl bg-white rounded-[28px] border border-gray-200 shadow-lg p-2 sm:p-8 md:p-5 " >
        
        <div className="flex justify-center">
          <div
            className=" w-10 h-10 md:w-15 md:h-15 rounded-full bg-[#FAF8F5] border border-gray-200 flex items-center justify-center shadow-sm " >
            <Mail className="size-[25px] md:size-[30px] text-[#D8A329]"/>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-4">
          <p
            className=" uppercase tracking-[4px] text-[#D8A329] text-xs sm:text-[12px] font-medium " >
            Account Security
          </p>

          <h1
            className=" text-1xl sm:text-2xl md:text-4xl font-serif text-black leading-tight mt-2 " >
            Verify Your
          </h1>

          <h2
            className=" text-1xl sm:text-3xl md:text-4xl font-serif text-[#D8A329] leading-tight " >
            Email Address
          </h2>
        </div>

        {/* Description */}
        <div className="text-center mt-3">
          <p className="text-sm sm:text-[12px] text-gray-500">
            We've sent a verification link to
          </p>

          <p
            className=" font-semibold text-base sm:text-lg text-black mt-1 break-all " >
            {email}
          </p>

          <p
            className=" text-gray-500 text-sm sm:text-[12px] mt-3 leading-relaxed max-w-lg mx-auto " >
            Please open your inbox and click the verification
            link to activate your account. Once verified,
            you'll gain access to tournaments, rankings,
            rewards, and all Gamix platform features.
          </p>
        </div>

        {/* Info Box */}
        <div
          className=" mt-4 bg-[#FAF8F5] rounded-2xl border border-[#EFEAE4] p-3 sm:p-3 " >
          <div className="flex gap-3">
            <ShieldCheck
              size={26}
              className=" text-[#D8A329]  flex-shrink-0  mt-1 " />

            <div>
              <h3 className="font-semibold text-base">
                Didn't receive the email?
              </h3>

              <p
                className=" text-gray-500 text-[12px] mt-0 leading-relaxed " >
                Check your spam, junk, or promotions folder.
                Email delivery may take a few minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 space-y-3">
          <button
            className=" w-full h-10 sm:h-12 rounded-2xl bg-black text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-90 transition " >
            <RefreshCcw size={16} />
            Resend Verification Link
          </button>

        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            Wrong email address?
          </p>

          <button
            className=" mt-1 text-[#D8A329] font-medium text-sm hover:underline " >
            Change Email Address
          </button>
        </div>
      </div>
    </section>
  );
};





