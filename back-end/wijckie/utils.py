def add_protocol(use_tls, url):
    return "{}://{}".format("https" if use_tls else "http", url)
