from mailtrap import Mail,Address,MailtrapClient
from .email_client import MAIL_FROM,MAILTRAP_API_TOKEN
from app.core.db.session import SessionLocal
from app.modules.auth.models import PendingRegistration
from urllib.parse import urlparse,parse_qs
from datetime import datetime,UTC

class AuthEmailService:

    def __init__(self):
        pass

    async def send_verification_email(
            self,
            email:str,
            verify_url:str
        ):
        print("EMAIL TASK STARTED...")
        pending_user = None

        db = SessionLocal()

        # MAIL CONTENT BODY
        html_content=f"""
            <!DOCTYPE html>

            <html>
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            </head>

            <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f7;padding:40px 0;">
            <tr>
            <td align="center">

            <table role="presentation"
            width="700"
            cellspacing="0"
            cellpadding="0"
            style="
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,.08);
            ">

            <!-- Header -->

            <tr>
            <td style="padding:35px 50px 20px;">

            <table width="100%">
            <tr>

            <td align="left">
            <span style="
            font-size:42px;
            font-weight:800;
            color:#111827;
            letter-spacing:-1px;
            ">
            Gamix<span style="color:#D4A017;">.</span>
            </span>
            </td>

            <td align="right">
            <span style="
            font-size:14px;
            letter-spacing:6px;
            color:#6b7280;
            font-weight:500;
            ">
            ESPORTS ARENA
            </span>
            </td>

            </tr>
            </table>

            </td>
            </tr>

            <!-- Divider -->

            <tr>
            <td>
            <div style="
            height:2px;
            background:linear-gradient(90deg,#D4A017,#F4C542);
            "></div>
            </td>
            </tr>

            <!-- Hero -->

            <tr>
            <td align="center" style="padding:60px 50px 30px;">

            <div style="
            width:80px;
            height:80px;
            line-height:80px;
            border-radius:50%;
            background:#fff8e7;
            margin:0 auto 25px;
            font-size:36px;
            ">
            🛡️
            </div>

            <div style="
            font-size:20px;
            color:#6b7280;
            margin-bottom:10px;
            ">
            Welcome to
            </div>

            <div style="
            font-size:56px;
            font-weight:900;
            line-height:1.1;
            letter-spacing:-2px;
            margin-bottom:20px;
            ">
            <span style="color:#111827;">ESPORTS</span>
            <span style="color:#D4A017;"> ARENA</span>
            </div>

            <div style="
            width:60px;
            height:3px;
            background:#D4A017;
            margin:0 auto 30px;
            "></div>

            <h2 style="
            margin:0;
            font-size:34px;
            color:#111827;
            font-weight:700;
            ">
            Thank you for registering!
            </h2>

            <p style="
            margin:25px auto;
            max-width:500px;
            font-size:18px;
            line-height:1.7;
            color:#6b7280;
            ">
            Please verify your email address to activate your account
            and start participating in tournaments, leaderboards,
            and exclusive esports events.
            </p>

            </td>
            </tr>

            <!-- CTA -->

            <tr>
            <td align="center" style="padding:10px 50px 50px;">

            <a href="{verify_url}"
            style="
            display:inline-block;
            background:#D4A017;
            color:#ffffff;
            text-decoration:none;
            font-size:22px;
            font-weight:700;
            padding:18px 50px;
            border-radius:10px;
            ">
            VERIFY EMAIL → </a>

            </td>
            <td>{verify_url}</td>
            </tr>


            <!-- Security Message -->

            <tr>
            <td align="center" style="padding:0 50px 50px;">

            <p style="
            margin:0;
            font-size:15px;
            color:#9ca3af;
            ">
            🔒 This verification link is secure and expires in 24 hours.
            </p>

            </td>
            </tr>

            <!-- Footer -->

            <tr>
            <td style="
            border-top:1px solid #e5e7eb;
            padding:35px 50px;
            ">

            <table width="100%">
            <tr>

            <td align="left">

            <div style="
            font-size:18px;
            font-weight:800;
            color:#111827;
            margin-bottom:10px;
            ">
            Gamix<span style="color:#D4A017;">.</span>
            </div>

            <div style="
            font-size:14px;
            color:#6b7280;
            ">
            FOR THOSE WHO REFUSE TO LOSE.
            </div>

            </td>

            <td align="right">

            <div style="
            font-size:14px;
            color:#9ca3af;
            ">
            www.gamix.com
            </div>

            </td>

            </tr>
            </table>

            </td>
            </tr>

            </table>

            </td>
            </tr>
            </table>

            </body>
            </html>
            """


        mail = Mail(
            sender = Address(
                email=MAIL_FROM,
                name="MLBB Tournament Platform"
            ),
            to     = [
                    Address(email="vizzaymeena@gmail.com")
            ],
            subject="Verify Your Email",
            html=html_content
        )

        client = MailtrapClient(MAILTRAP_API_TOKEN)
        print("Mail Trap API Token",MAILTRAP_API_TOKEN)
        try:
            
            pending_user = (
                db.query(PendingRegistration)
                .filter(PendingRegistration.email == email)
                .first()
            )
            response = client.send(mail)
            print("EMAIL SENT:",response)

            # ensure pending_user exists before checking its status
            if pending_user and pending_user.email_sent == "SENT":
                pending_user.last_resent_at = datetime.now(UTC)

                pending_user.resent_count += 1
                db.add(pending_user)
                db.commit()

            else:
                if pending_user:
                    pending_user.email_sent = "SENT"
                    db.add(pending_user)
                    db.commit()

        except Exception as e :

            if pending_user:
                if pending_user.email_sent == "PENDING":
                    pending_user.email_sent = "FAILED"
                    pending_user.last_error = str(e)    
                    db.add(pending_user)
                    db.commit()

                else:
                    pending_user.email_sent = "FAILED"
                    db.commit()

            print("MAIL TRAP ERROR",e)
            raise 

        finally:
            db.close()

            


   