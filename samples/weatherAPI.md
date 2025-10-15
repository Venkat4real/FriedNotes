# 🌦️ Bengaluru Climate Tracker API

## 📝 Overview

Welcome to the documentation for the **Bengaluru Climate Tracker API**!

This project is a dedicated service for tracking the famously unpredictable climate of Bengaluru. It answers the city's most critical daily question: *Do I need a sweater, or will the AC be too much?*

**Why this API is awesome:**
1.  **Laser-focused:** Just pure, unadulterated meteorological data.
2.  **Locality-aware:** It knows that the weather in Electronic City is a different universe from Indiranagar.

***

## 🚀 Getting Started

### Base URL

All requests should be prefixed with the base URL:

`https://api.myportfolio.com/v1/bengaluru-climate`

### Authentication

**Status:** Currently **Open Access**. No API key is required.

> **Note:** For a production-ready system, proper **OAuth 2.0** or **API Key** authentication is mandatory. But hey, this is my portfolio—consider it a free preview! 

***

## 🌐 Endpoints

### 1. GET /current

#### Description
Retrieves the most up-to-date weather conditions for a specific locality in Bengaluru. Essential for deciding if your afternoon run is a good idea.

#### Parameters

| Name | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `locality` | `string` | **Yes** | The neighborhood to check. **(Required)** | `Koramangala`, `Whitefield` |
| `unit` | `string` | Optional | Temperature unit. **C** for Celsius (default) or **F** for Fahrenheit. | `F` |

#### Example Request

```http
GET /current?locality=Jayanagar&unit=C
