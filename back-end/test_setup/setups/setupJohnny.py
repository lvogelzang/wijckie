import datetime
from allauth.account.models import EmailAddress
from test_setup.factory.InspirationItemFactory import InspirationItemFactory
from test_setup.factory.InspirationOptionFactory import InspirationOptionFactory
from test_setup.factory.InspirationWidgetFactory import InspirationWidgetFactory
from test_setup.factory.dailyTodosItemFactory import DailyTodoItemFactory
from test_setup.factory.dailyTodosModuleFactory import DailyTodosModuleFactory
from test_setup.factory.dailyTodosOptionFactory import DailyTodosOptionFactory
from test_setup.factory.dailyTodosWidgetFactory import DailyTodosWidgetFactory
from test_setup.factory.emailAddressFactory import EmailAddressFactory
from test_setup.factory.inspirationModuleFactory import InspirationModuleFactory
from wijckie_models.modules.dailyTodos import DailyTodoItemStatus
from wijckie_models.user import Language, TimeZone, User


def setup_johnny():
    johnny = User(
        username="JohnnyT3ST",
        first_name="Johnny",
        last_name="Test",
        email="j.test@wijckie.com",
        language=Language.EN_GB,
        time_zone=TimeZone.EUROPE_LONDON,
    )
    johnny.save()

    email_address_factory = EmailAddressFactory(johnny)
    email_address_factory.create("j.test@wijckie.com", primary=True)
    email_address_factory.create("j.test-2@wijckie.com")

    date_1 = datetime.date(2026, 1, 1)
    date_2 = datetime.date(2026, 1, 2)

    # --- Daily Todos ---

    daily_todos_module_factory = DailyTodosModuleFactory(johnny)
    daily_todos_module = daily_todos_module_factory.create("Daily todos")

    daily_todo_option_factory = DailyTodosOptionFactory(daily_todos_module)
    paper = daily_todo_option_factory.create("News paper", "Read the news paper")
    social_media = daily_todo_option_factory.create(
        "Social media", "Limited use of social media"
    )
    water = daily_todo_option_factory.create("Water", "Drink enough water")
    walk = daily_todo_option_factory.create("Walk", "Go for a walk")

    daily_todos_widget_factory = DailyTodosWidgetFactory(daily_todos_module)
    daily_todos_widget_factory.create("Daily todos")

    daily_todo_item_factory = DailyTodoItemFactory(daily_todos_module)
    daily_todo_item_factory.create(date_1, paper, DailyTodoItemStatus.TODO)
    daily_todo_item_factory.create(date_1, social_media, DailyTodoItemStatus.SKIP)
    daily_todo_item_factory.create(date_1, water, DailyTodoItemStatus.DONE)

    # --- Inspiration ---

    inspiration_module_factory = InspirationModuleFactory(johnny)
    inspiration_module = inspiration_module_factory.create("Inspiration")

    inspiration_option_factory = InspirationOptionFactory(inspiration_module)
    happiness = inspiration_option_factory.create_text(
        "Happiness",
        "The happiness of your life depends on the quality of your thoughts",
    )
    artwork = inspiration_option_factory.create_image(
        "Artwork", "c6cd7f84-5d93-4054-9488-369563bc8aa3", "artwork.png"
    )

    inspiration_widget_factory = InspirationWidgetFactory(inspiration_module)
    inspiration_widget_factory.create("Inspiration")

    inspiration_item_factory = InspirationItemFactory(inspiration_module)
    inspiration_item_factory.create(date_1, happiness)
    inspiration_item_factory.create(date_2, artwork)
