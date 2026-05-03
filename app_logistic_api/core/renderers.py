from rest_framework.renderers import JSONRenderer

class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response') if renderer_context else None
        
        status_code = response.status_code if response else 200
        is_success = status_code >= 200 and status_code < 300

        # If data is already formatted, do not wrap it again
        if isinstance(data, dict) and 'success' in data and 'message' in data and 'data' in data and 'errors' in data:
            return super().render(data, accepted_media_type, renderer_context)

        custom_data = {
            'success': is_success,
            'message': 'Successful operation' if is_success else 'An error occurred',
            'data': data if is_success else None,
            'errors': data if not is_success else None
        }

        return super().render(custom_data, accepted_media_type, renderer_context)
