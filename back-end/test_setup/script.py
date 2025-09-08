from decouple import config
import logging

from test_setup.setups.setupJohnny import setup_johnny

logger = logging.getLogger(__name__)

env = config("DJANGO_CONFIGURATION")
if not "Dev" in env and not "Test" in env:
    raise Exception("Unknown profile for running test setup (" + env + ")")

logger.info("Selected env: " + config("DJANGO_CONFIGURATION"))

setup_johnny()
