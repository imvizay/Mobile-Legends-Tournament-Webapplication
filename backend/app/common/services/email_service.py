from mailtrap import Mail,Address,MailtrapClient
from .email_client import MAIL_FROM,MAILTRAP_API_TOKEN

class AuthEmailService:

    def __init__(self):
        pass

    async def send_verification_email(
            self,
            email:str,
            verify_url:str
        ):
        print("EMAIL TASK STARTED...")
        # MAIL CONTENT BODY
        html_content = f"""
        <html>
            <body>
                <h2>Welcome to Esports Arena</h2>

                <p>
                    Thank you for registering.
                </p>

                <p>
                    Please verify your email address by clicking
                    the button below.
                </p>

                <a
                    href="{verify_url}"
                    style="
                        background:#2563eb;
                        color:white;
                        padding:12px 20px;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Verify Email
                </a>

                <p>
                    This link will expire in 24 hours.
                </p>
            </body>
        </html>
        """

        mail = Mail(
            sender = Address(
                email=MAIL_FROM,
                name="MLBB Tournament Platform"
            ),
            to     = [
                    Address(email=email)
            ],
            subject="Verify Your Email",
            html=html_content
        )

        client = MailtrapClient(MAILTRAP_API_TOKEN)
        print("Mail Trap API Token",MAILTRAP_TOKEN)
        try:
            client.send(mail)
            print("EMAIL SENT.")
        except Exception as e :
            
            print("MAIL TRAP ERROR",e)


   