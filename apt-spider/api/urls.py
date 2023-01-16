from django.urls import path,include
from . import views
from . import html_scraper
from . import article_scraper
from . import imdb
from . import emotion_and_sentiment_analysis as em_sl_analysis
from . import wikipedia
urlpatterns = [
    path('html_scraper', html_scraper.html_scraper),
    path('html_scraper_v2', html_scraper.html_scraper_v2),
    path('platform', views.my_platform),
    path('article_scraper', article_scraper.article_scraper),
    path('text_emotions_analysis', em_sl_analysis.emotions_in_text),
    path('text_emotions_analysis_v2', em_sl_analysis.emotions_in_text_using_text2emotion),
    path('text_sentiment_analysis', em_sl_analysis.sentiment_in_text),
    path('emotion_and_sentiment_in_text_multiple', em_sl_analysis.emotion_and_sentiment_in_text_multiple),
    path('emotion_in_text_multiple', em_sl_analysis.emotion_in_text_multiple),
    path('get_detail_by_id_v1', imdb.get_detail_by_id_v1),
    path('article_scraper_with_emotion_and_sentiment', article_scraper.article_scraper_with_emotion_and_sentiment_analysis),
    path('wikipedia_search',wikipedia.wikipedia_search),
    path('wikipedia_search_without_summary',wikipedia.wikipedia_search_without_summary),
    path('wikipedia_summary',wikipedia.wikipedia_summary),
]