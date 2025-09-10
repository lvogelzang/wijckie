from allauth.account.models import EmailAddress


class EmailAddressFactory:
    def __init__(self, user):
        self.user = user

    def create(self, email, verified=True, primary=False):
        address = EmailAddress(
            user=self.user, email=email, verified=verified, primary=primary
        )
        address.save()
        return address
