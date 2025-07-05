from django import template
register = template.Library()

@register.filter
def get_item(dictionary, key):
    return dictionary.get(str(key))

@register.filter
def get_item_int(dictionary, key):
    try:
        return dictionary.get(str(key))
    except (ValueError, TypeError):
        return None
