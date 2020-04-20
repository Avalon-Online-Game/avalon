from django.core.cache import cache
import pickle 

def set_value(key, value):
    cache.set(key, pickle.dumps(value))

def update_value(key, value):
    cache.delete(key)
    cache.set(key, pickle.dumps(value))

def get_value(key):
    pickled_value = cache.get(key)
    if pickled_value is None:
        return None
    return pickle.loads(pickled_value)