import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Load dataset
df = pd.read_csv(r"D:\LE03\Project\SA\Datasets\amazon.csv")

# Clean price columns: remove ₹ and commas, convert to float
df['discounted_price'] = df['discounted_price'].replace('[₹,]', '', regex=True).astype(float)
df['actual_price'] = df['actual_price'].replace('[₹,]', '', regex=True).astype(float)
df['rating_count'] = df['rating_count'].replace(',', '', regex=True).astype(int)
df['rating'] = df['rating'].astype(float)

# Features and target
X = df[['discounted_price', 'actual_price', 'rating_count']]
y = df['rating']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict and evaluate
predictions = model.predict(X_test)
print("Mean Squared Error:", mean_squared_error(y_test, predictions))
